export type Profile = {
  id: string;
  display_name: string;
  font_family: string;
  text_color: string;
  bubble_color: string;
  show_status_bar: boolean;
  statuses: string[]; // custom status options for dropdown
  current_status: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  font_family: string;
  text_color: string;
  bubble_color: string;
};

export type Room = {
  id: string;
  code: string; // invite/join code
  name: string;
  created_by: string | null;
  created_at: string;
};
