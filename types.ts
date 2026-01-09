
export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER'
}

export interface Alert {
  id: string;
  timestamp: string;
  hostname: string;
  severity: Severity;
  ruleTriggered: string;
  confidence: number;
  commandLine: string;
  processId: number;
  parentProcessId: number;
  processName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  status: 'SUCCESS' | 'FAILURE';
}

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  yaml: string;
  enabled: boolean;
}
