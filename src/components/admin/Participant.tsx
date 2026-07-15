export interface Participant {
  id: number;
  fullname: string | null;
  email?: string;
  faculty?: string | null;
  batch: number;
  imgUrl: string | null;

  progress: {
    percentage: number;
  };
}

export interface ParticipantsData {
  users: Participant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
