import { skipToken, useQuery } from '@tanstack/react-query';
import { plantLayoutQueryOptions } from '@/hooks/dashboard/dashboardQueries';
import { PlantModel } from '@/enums/dashboard/plantModel';

/** The representative layout and assets of a plant model. Waits until the model is known. */
export const usePlantLayout = (model: PlantModel | undefined) =>
  useQuery({
    ...plantLayoutQueryOptions(model ?? PlantModel.PROCESS_PLANT),
    ...(model ? {} : { queryFn: skipToken }),
  });
