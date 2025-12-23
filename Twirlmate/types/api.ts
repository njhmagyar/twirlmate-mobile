export interface EventType {
  name: string;
  id: number;
}

export interface Address {
  name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  territory: string;
  country: string;
  country_display: string;
  zip_code: string;
  type: string;
  id: number;
}

export interface EventDateListItem {
  event: {
    name: string;
    image: string;
    types: EventType[];
    format: string;
    location: string;
    id: number;
  };
  start: string;
  end: string;
  registration_open: string;
  registration_close: string;
  registration_upcoming: boolean;
  registration_available: boolean;
  registration_closed: boolean;
  video_entry_deadline: string | null;
  awards_announcement: string | null;
  organizations: any[];
  tiers: any[];
  mobile_detail_url: string;
  registration_url: string;
  offer_refunds: boolean;
  refund_request_deadline: string | null;
  music_submission_url: string;
  music_submission_email: string;
  id: number;
}

export interface EventDateDetail {
  event: {
    name: string;
    image: string;
    types: EventType[];
    format: string;
    location: string;
    overview_description: string;
    order_of_events: string;
    awards_description: string;
    cancellation_policy: string;
    rules: string;
    additional_information: string;
    contact_name: string;
    contact_email: string;
    contact_phone_number: string;
    contact_fax_number: string;
    website: string;
    facebook_url: string;
    instagram_url: string;
    x_url: string;
    youtube_url: string;
    primary_address: Address | null;
    secondary_address: Address | null;
    contact_address: Address | null;
    id: number;
  };
  start: string;
  end: string;
  registration_open: string;
  registration_close: string;
  registration_upcoming: boolean;
  registration_available: boolean;
  registration_closed: boolean;
  video_entry_deadline: string | null;
  awards_announcement: string | null;
  organizations: any[];
  tiers: any[];
  mobile_detail_url: string;
  registration_url: string;
  offer_refunds: boolean;
  refund_request_deadline: string | null;
  music_submission_url: string;
  music_submission_email: string;
  id: number;
}

export interface CoachListItem {
  id: number;
  name: string;
  image: string;
  location: string;
  mobile_detail_url: string;
}

export interface CoachDetail {
  id: number;
  name: string;
  bio: string;
  image: string;
  location: string;
  coach_specialties: string[];
  profile_visibility: string;
  web_detail_url: string;
  web_coach_request_url: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  location: string;
  type: string;
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  imageUrl?: string;
}