import { renderHook, act } from "@testing-library/react";
import { useProjectsApi, mapData } from "../use-project-api";
import { CreateProjectDTO } from "@/types/project.types";
import axios from "axios";

jest.mock("axios");
const mockData = axios as jest.Mocked<typeof axios>;
describe("useProjectApi", () => {
    const projectData: CreateProjectDTO = {
        client_id: "550e8400-e29b-41d4-a716-446655440000",
        title: "Test project",
        description: "Development",
        category: "Frontend Developer",
        budget: 1000,
        status: "draft"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Created project successly", async () => {
        const mockResponse = { data: { ...projectData, id: "123" } };
        mockData.post.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useProjectsApi());
        let createdProject;
        await act(async () => {
            createdProject = await result.current.createProject(projectData);
        });
        expect(mockData.post).toHaveBeenCalledWith(
            "/api/projects",
            projectData
        );
        expect(createdProject).toEqual(mockResponse.data);
    });

    it("throws an error if project creation fails", async () => {
        mockData.post.mockRejectedValueOnce({
            response: { data: { message: "Error to create" } },
        });

        const { result } = renderHook(() => useProjectsApi());
        await expect(result.current.createProject(projectData)).rejects.toThrow(
            "Error to create"
        );
    })

    it("get all projects", async () => {
        const mockResponse = { data: [projectData] };
        mockData.get.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useProjectsApi());
        let projects;
        await act(async () => {
            projects = await result.current.getProjects();
        });

        expect(mockData.get).toHaveBeenCalledWith("/api/projects");
        expect(projects).toEqual(mockResponse.data);
    });

    it("mapData mapping the data correctly", () => {
        const rawData = {
            title: "Draft project",
            description: "this is a new project",
            category: "Full Stack Development",
            budgetAmount: 1500,
        };

        const user = { id: "550e8400-e29b-41d4-a716-446655440000" };

        const mapped = mapData(rawData, user);
        expect(mapped).toEqual({
            client_id: "550e8400-e29b-41d4-a716-446655440000",
            title: "Draft project",
            description: "this is a new project",
            category: "Full Stack Development",
            budget: 1500,
            status: "draft",
        });
    })
})