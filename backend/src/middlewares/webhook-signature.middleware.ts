import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { supabase } from "@/lib/supabase/supabase";
import crypto from "crypto";

/**
 * Webhook Signature Verification Middleware
 * Verifies webhook signatures using HMAC-SHA256
 */
export const verifyWebhookSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.get("x-webhook-signature");
    
    if (!signature) {
      return res.status(401).json({
        success: false,
        error: { code: "MISSING_SIGNATURE", message: "Missing webhook signature" },
      });
    }

    // Extract webhook ID from URL params
    const webhookId = req.params.webhook_id;
    if (!webhookId) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_WEBHOOK_ID", message: "Webhook ID is required" },
      });
    }

    // Get webhook secret from database
    const { data: webhook, error } = await supabase
      .from("webhooks")
      .select("secret")
      .eq("id", webhookId)
      .single();

    if (error || !webhook) {
      return res.status(404).json({
        success: false,
        error: { code: "WEBHOOK_NOT_FOUND", message: "Webhook not found" },
      });
    }

    // Get raw body for signature verification
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", webhook.secret)
      .update(rawBody, "utf8")
      .digest("hex");

    const providedSignature = signature.replace("sha256=", "");

    if (!crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(providedSignature, "hex")
    )) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_SIGNATURE", message: "Invalid webhook signature" },
      });
    }

    // Attach webhook info to request for use in route handlers
    (req as any).webhookId = webhookId;
    (req as any).webhookSecret = webhook.secret;

    next();
  } catch (error) {
    next(new AppError("Webhook signature verification failed", 500));
  }
};

/**
 * Raw Body Parser Middleware for Webhooks
 * Captures raw body for signature verification
 */
export const rawBodyParser = (req: Request, res: Response, next: NextFunction) => {
  let data = "";
  
  req.setEncoding("utf8");
  
  req.on("data", (chunk) => {
    data += chunk;
  });
  
  req.on("end", () => {
    (req as any).rawBody = data;
    try {
      req.body = JSON.parse(data);
    } catch (error) {
      // If JSON parsing fails, keep raw body
      req.body = data;
    }
    next();
  });
};
