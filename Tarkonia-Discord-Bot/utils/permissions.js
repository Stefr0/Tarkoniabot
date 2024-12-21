export function checkPermissions(member, command) {
  if (!command.permissions) return true;
  
  try {
    return member.permissions.has(command.permissions);
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false; // Assume no permission in case of error
  }
}

