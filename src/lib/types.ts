export type OrderStatus = 'received' | 'in_progress' | 'completed' | 'issue';
export type ContainerAction = 'placement' | 'exchange' | 'removal';

export interface Order {
  id: string; // מספר ההזמנה (למשל: 621025)
  customerId: string;
  projectId: string;
  createdAt: number; // חותמת זמן
  status: OrderStatus;
  action: ContainerAction;
  address: string;
  siteContact: {
    name: string;
    phone: string;
  };
  contractorId?: string; // מזהה הקבלן המבצע (אם שובץ)
  deliveryNoteUrl?: string; // תעודת משלוח
}

export interface Project {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
}
