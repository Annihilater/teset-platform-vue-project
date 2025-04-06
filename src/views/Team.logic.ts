import { TeamService } from "@/mock/services/team";
import type { User } from "@/mock/types/user";
import type { Team } from "@/mock/types/team";

export const getTeamMetricsColor = (value: number, type: "passRate" | "automationRate") => {
  if (type === "passRate") {
    return value >= 90
      ? "text-green-600"
      : value >= 75
      ? "text-yellow-600"
      : "text-red-600";
  }
  return value >= 70
    ? "text-green-600"
    : value >= 50
    ? "text-yellow-600"
    : "text-red-600";
};

export const getUsersByTeam = (teamId: string, teamMembers: User[]) => {
  return teamMembers.filter((user) => user.teams.includes(teamId));
};

export const getRoleText = (role: string) => {
  switch (role) {
    case "manager":
      return "管理员";
    case "tester":
      return "测试员";
    case "admin":
      return "超级管理员";
    case "viewer":
      return "查看者";
    default:
      return role;
  }
};

export const loadTeams = async (searchQuery: string) => {
  if (searchQuery) {
    return await TeamService.searchTeams(searchQuery);
  } else {
    return await TeamService.getAllTeams();
  }
};

export const loadTeamMembers = async () => {
  return await TeamService.getAllTeamMembers();
};

export const loadRecentActivities = async () => {
  return await TeamService.getRecentActivities();
};