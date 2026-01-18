export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'paid':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'pending':
      return 'Pending';
    case 'paid':
      return 'Paid';
    default:
      return status;
  }
};

