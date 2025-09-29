"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useStartDisputeForm } from "../../hooks/useStartDispute";
import { ValidatedInput } from "./validated-input";
import { validationSchemas } from "@/utils/validation";
import { useState } from "react";

export function StartDisputeForm() {
  const { form, loading, response, onSubmit } = useStartDisputeForm();
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const handleFieldValidation = (field: string) => (isValid: boolean) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: !isValid
    }));
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract / Escrow ID</FormLabel>
                <FormControl>
                  <ValidatedInput
                    name="contractId"
                    label=""
                    value={field.value || ''}
                    onChange={field.onChange}
                    onValidation={handleFieldValidation('contractId')}
                    validationRules={validationSchemas.contractId}
                    placeholder="CAZ6UQX7..."
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="signer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signer Address</FormLabel>
                <FormControl>
                  <ValidatedInput
                    name="signer"
                    label=""
                    value={field.value || ''}
                    onChange={field.onChange}
                    onValidation={handleFieldValidation('signer')}
                    validationRules={validationSchemas.address}
                    placeholder="GSIGN...XYZ"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Dispute</FormLabel>
                <FormControl>
                  <ValidatedInput
                    name="reason"
                    label=""
                    value={field.value || ''}
                    onChange={field.onChange}
                    onValidation={handleFieldValidation('reason')}
                    validationRules={validationSchemas.reason}
                    placeholder="Describe the reason for the dispute..."
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={loading || Object.values(fieldErrors).some(error => error)} 
            className="w-full"
          >
            {loading ? "Starting Dispute..." : "Start Dispute"}
          </Button>
        </form>
      </Form>

      {response && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold text-green-800">Success!</h3>
          <p className="text-green-700">Dispute started successfully.</p>
          <pre className="mt-2 text-xs text-green-600 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}