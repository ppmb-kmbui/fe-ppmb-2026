export interface Participant {
  id: number;
  fullname: string;
  batch: number;
  imgUrl: string | null;

  progress: {
    percentage: number;
  };
}

export interface ParticipantsData {
  users: Participant[];
}