export interface Order {
  id: string;              // המזהה ב-Firebase
  orderNumber: string;     // המספר ללקוח (למשל 621025)
  status: 'received' | 'in_progress' | 'completed';
  type: 'placement' | 'exchange' | 'removal'; // הצבה, החלפה, פינוי
  address: string;
  createdAt: any;          // Timestamp
}

export interface Container {
  id: string;
  projectId: string;
  address: string;
  daysLeft: number;        // כמה ימים נשארו לשכירות
  percent: number;         // אחוז למד (ויזואלי)
  status: 'active' | 'expired';
}
