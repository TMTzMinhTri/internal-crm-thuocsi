export const TicketStatus = {
    PENDING: "PENDING",
    ASSIGNED: "ASSIGNED",
    IN_PROCESS: "IN_PROCESS",
    DONE: "DONE",
    CANCELLED: "CANCELLED",
};

export const TicketStatusLabel = {
    [TicketStatus.PENDING]: "Chưa xử lý",
    [TicketStatus.ASSIGNED]: "Đã tiếp nhận",
    [TicketStatus.IN_PROCESS]: "Đang xử lý",
    [TicketStatus.DONE]: "Đã xử lý",
    [TicketStatus.CANCELLED]: "Đã huỷ",
};

export const TicketStatusColor = {
    [TicketStatus.PENDING]: "#cc5555",
    [TicketStatus.ASSIGNED]: "#0066dd",
    [TicketStatus.IN_PROCESS]: "#0066dd",
    [TicketStatus.DONE]: "#2b6",
    [TicketStatus.CANCELLED]: "#bbb",
};
