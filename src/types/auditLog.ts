export interface AuditLogEntry {
  id: number;
  createdAt: string;
  action: string;
  entityType: string;
  entityId?: number;
  details?: string;
  actorUserId?: number;
  actorEmail?: string;
}

export interface AuditLogPageDto {
  items: AuditLogEntry[];
  totalCount: number;
  page: number;
  pageSize: number;
}
