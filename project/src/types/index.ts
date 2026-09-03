export type UserRole = 'student' | 'seller' | 'tutor' | 'business' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export type HousingVerification = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  university?: string;
  campus?: string;
  city: string;
  roles: UserRole[];
  verification: VerificationStatus;
  studentStatus: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  bio?: string;
  subscriptionPlan: 'free' | 'premium' | 'business';
  blocked?: boolean;
}

export interface University {
  id: string;
  name: string;
  city: string;
  campuses: string[];
}

export type ListingCategory =
  | 'Electronics'
  | 'Phones'
  | 'Computers'
  | 'Books'
  | 'Fashion'
  | 'Furniture'
  | 'Accessories'
  | 'School supplies'
  | 'Services'
  | 'Other';

export type ListingCondition = 'New' | 'Like New' | 'Good' | 'Used';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  images: string[];
  condition: ListingCondition;
  city: string;
  neighborhood?: string;
  university?: string;
  campus?: string;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  contactMethod: 'app' | 'whatsapp' | 'phone';
  contactPhone?: string;
  createdAt: string;
  status: ListingStatus;
  featured?: boolean;
  boosted?: boolean;
  views: number;
  saves: number;
}

export type JobCategory =
  | 'Part-time'
  | 'Freelance'
  | 'Event work'
  | 'Delivery'
  | 'Programming'
  | 'Graphic Design'
  | 'Marketing'
  | 'Photography'
  | 'Tutoring'
  | 'Customer Service'
  | 'Other';

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  city: string;
  date?: string;
  duration?: string;
  category: JobCategory;
  employer: string;
  employerVerified: boolean;
  deadline: string;
  contactMethod: 'app' | 'whatsapp' | 'email';
  contactPhone?: string;
  createdAt: string;
  status: ListingStatus;
  saves: number;
  applications: number;
}

export type TutorSubject =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Programming'
  | 'English'
  | 'French'
  | 'Economics'
  | 'Law'
  | 'Engineering'
  | 'Statistics'
  | 'Computer Science';

export interface TutorReview {
  id: string;
  tutorId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Tutor {
  id: string;
  name: string;
  avatarUrl?: string;
  university: string;
  subject: TutorSubject;
  level: string;
  pricePerHour: number;
  online: boolean;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  description: string;
  availability: string;
  verified: boolean;
  reviews: TutorReview[];
}

export interface Housing {
  id: string;
  title: string;
  description: string;
  pricePerMonth: number;
  location: string;
  neighborhood: string;
  city: string;
  university?: string;
  distanceFromCampus?: string;
  rooms: number;
  water: boolean;
  electricity: boolean;
  internet: boolean;
  security: boolean;
  furnished: boolean;
  images: string[];
  landlord: string;
  landlordVerified: boolean;
  verification: HousingVerification;
  createdAt: string;
  saves: number;
}

export type ServiceCategory =
  | 'Web Development'
  | 'Graphic Design'
  | 'Video Editing'
  | 'Photography'
  | 'Writing'
  | 'Translation'
  | 'Computer Repair'
  | 'Printing'
  | 'Social Media Management'
  | 'Delivery'
  | 'Other';

export interface ServiceReview {
  id: string;
  serviceId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Service {
  id: string;
  provider: string;
  providerVerified: boolean;
  avatarUrl?: string;
  category: ServiceCategory;
  title: string;
  description: string;
  priceFrom: number;
  portfolio: string[];
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  contactMethod: 'app' | 'whatsapp';
  contactPhone?: string;
  reviews: ServiceReview[];
}

export interface CampusEvent {
  id: string;
  name: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  city: string;
  description: string;
  imageUrl?: string;
  ticketPrice: number;
  capacity: number;
  registered: number;
  category: string;
  saves: number;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface AppNotification {
  id: string;
  type: 'listing' | 'job' | 'subscription' | 'system' | 'message';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'listing' | 'job' | 'housing' | 'service' | 'event' | 'user';
  targetId: string;
  reason: 'Scam' | 'Fake listing' | 'Wrong price' | 'Inappropriate content' | 'Harassment' | 'Other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium' | 'business';
  startDate: string;
  endDate: string;
  active: boolean;
  price: number;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: 'subscription' | 'boost' | 'featured';
  status: 'pending' | 'completed' | 'failed';
  method: 'demo';
  createdAt: string;
  reference: string;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  targetType: 'listing' | 'job' | 'tutor' | 'housing' | 'service' | 'event';
  targetId: string;
  createdAt: string;
}
