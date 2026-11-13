import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLE_DESCRIPTION, ROLE_LABEL } from '@/constants/authConstants';
import { ACCOUNT_COPY } from '@/constants/dashboard/account/accountConstants';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { usePlants } from '@/hooks/dashboard/usePlants';

/** What the signed-in user is and can reach. */
export const AccountProfile = () => {
  const { user } = useCurrentUser();
  const { data: plants } = usePlants();

  if (!user) {
    return null;
  }

  const assignedPlants = (plants ?? []).filter((plant) => user.plantIds.includes(plant.id));
  const assignedPlantNames =
    assignedPlants.length > 0
      ? assignedPlants.map((plant) => plant.name).join(', ')
      : ACCOUNT_COPY.NO_PLANTS;
  const facts = [
    { label: ACCOUNT_COPY.EMAIL_LABEL, value: user.email },
    { label: ACCOUNT_COPY.ROLE_LABEL, value: ROLE_LABEL[user.role] },
    {
      label: ACCOUNT_COPY.PLANTS_LABEL,
      value: user.hasAllPlantAccess ? ACCOUNT_COPY.ALL_PLANTS : assignedPlantNames,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3>{user.fullName}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <dl className="flex flex-col divide-y text-sm">
          {facts.map((fact) => (
            <div key={fact.label} className="flex justify-between gap-4 py-2">
              <dt className="text-muted-foreground">{fact.label}</dt>
              <dd className="text-right">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted-foreground">{ROLE_DESCRIPTION[user.role]}</p>
      </CardContent>
    </Card>
  );
};
