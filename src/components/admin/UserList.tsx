
// Fix for the handleImpersonate function parameter
const handleImpersonate = async (userId: string) => {
  await impersonateUser(userId);
};

// And then in the Button onClick:
<Button
  variant="outline"
  size="icon"
  onClick={() => handleImpersonate(user.id)}
  title="Impersonate user"
>
  <UserCheck className="h-4 w-4" />
</Button>
