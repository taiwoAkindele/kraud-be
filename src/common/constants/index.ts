export enum BranchType {
  CLOUD_KITCHEN = 'Cloud Kitchen',
  FULL_SERVICE = 'Full Service',
  QUICK_SERVICE = 'Quick Service',
  DELIVERY_ONLY = 'Delivery Only',
}

export enum BranchStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum StaffRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  KITCHEN = 'kitchen',
  COURIER = 'courier',
}

export enum StaffDisplayRole {
  KITCHEN = 'Kitchen',
  ADMIN = 'Admin',
  WAITER = 'Waiter',
}

export enum StaffStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_LEAVE = 'On Leave',
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_PREP = 'in_prep',
  SERVED = 'served',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum StationType {
  KITCHEN = 'kitchen',
  BAR = 'bar',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
}

export enum TicketState {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  NEW = 'new',
  URGENT = 'urgent',
}

export enum KitchenOrderStatus {
  PENDING = 'pending',
  IN_PREP = 'in_prep',
  READY = 'ready',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}
