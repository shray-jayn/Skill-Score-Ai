import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import type { PaginationRequest } from "../models/file/file.model";
import type { TablePaginationConfig } from "antd/es/table";
import { CoachingSession } from "../models/coaching-session/coaching-session.model";
import { coachingService } from "../services/report.service";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";
import { useNavigate } from "react-router-dom";

const RecentFilesTable: React.FC = () => {
  const [coachingSession, setCoachingSession] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationRequest>({
      limit: 8,
      offset: 0, 
  });
  
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  
  const fetchCoachingSessions = async () => {
      try {
          setLoading(true);
          const userId = auth.user?.userId;
          if (!userId) {
              throw new Error("User ID is missing.");
          }
          const sessions = await coachingService.fetchSessions({ 
              userId, 
              limit: pagination.limit, 
              offset: pagination.offset 
          });
          if (sessions.success) {
              setCoachingSession(sessions.data || []);
          }
  
      } catch (error: any) {
          message.error(error.message || "Failed to fetch coaching sessions.");
      } finally {
          setLoading(false);
      }
  };
  
  useEffect(() => {
    fetchCoachingSessions();
  }, [pagination]);

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    // Calculate offset and limit for the clicked page
    const currentPage = paginationConfig.current || 1;
    const pageSize = paginationConfig.pageSize || 8;

    setPagination({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });
  };

  const handleRowClick = (record: CoachingSession) => {
  navigate(`/report/${record.coaching_round_id}`, {
    state: { ...record }, 
  });
};

  const columns = [
    {
        title: "Team",
        dataIndex: "coaching_session_name",
        key: "coaching_session_name",
        render: (text: string) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
        title: "Coach",
        dataIndex: "coachee_name",
        key: "coachee_name",
        render: (text: string) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
        title: "Recording Date",
        dataIndex: "date",
        key: "date",
        render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
        title: "Round",
        dataIndex: "round",
        key: "round",
        render: (round: number) => <span className="font-medium text-gray-700">{round}</span>,
    },
];

return (
    <div className="p-4 bg-white shadow-sm rounded-lg">
        <Table
                columns={columns}
                dataSource={coachingSession}
                loading={loading}
                pagination={{
                    current: pagination.offset / pagination.limit + 1,
                    pageSize: pagination.limit,
                    total: 500,
                }}
                rowKey={(record) => record.coaching_round_id}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                onChange={handleTableChange}
            />
    </div>
);
};

export default RecentFilesTable;
