export interface VirtualLab {
  id: string;
  name: string;
  decription: string;
  referenceEMail: string;
  members: VirtualLabMember[];
  plan?: 'entry' | 'beginner' | 'intermediate' | 'advanced';
  billing: {
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface VirtualLabMember {
  name: string;
  email: string;
  role: 'admin' | 'user';
}
