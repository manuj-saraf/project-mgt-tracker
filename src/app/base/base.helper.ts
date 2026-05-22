  export const allNavigationLinks = [
    { id:'addMember', label: 'Add Member', route: '/home/add-member', description: 'Add new team members to your project' },
    { id:'viewMember', label: 'View Members', route: '/home/view-members', description: 'View and manage team members' },
    { id:'assignTask', label: 'Assign Task', route: '/home/assign-task', description: 'Assign tasks to your team members' },
    { id:'approveTask', label: 'Approve Task', route: '/home/approve-task', description: 'Approve tasks submitted by your team members' },
    { id:'viewTask', label: 'View Task', route: '/home/view-task', description: 'View and track tasks' },
    { id:'allocation', label: 'Allocation', route: '/home/update-allocation', description: 'Manage resource allocation' }
  ];



  export interface NavigationData {
    id: string;
    label: string;
    route : string;
    description: string;
  }