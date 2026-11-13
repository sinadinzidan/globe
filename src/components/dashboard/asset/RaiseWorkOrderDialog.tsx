import { useId, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { FormField } from '@/components/shared/form/FormField';
import { FormMessage } from '@/components/shared/form/FormMessage';
import { SubmitButton } from '@/components/shared/form/SubmitButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ASSET_COPY } from '@/constants/dashboard/asset/assetPageConstants';
import { WORK_ORDER_TYPE_LABEL } from '@/constants/dashboard/assetConstants';
import { WorkOrderType } from '@/enums/dashboard/workOrderType';
import { useCreateWorkOrder } from '@/hooks/dashboard/asset/useAssetRecords';
import { findEnumValue } from '@/lib/enumValue';

interface RaiseWorkOrderDialogProperties {
  plantId: string;
  assetId: string;
  onClose: () => void;
}

const TYPE_ORDER = Object.values(WorkOrderType);

export const RaiseWorkOrderDialog = ({
  plantId,
  assetId,
  onClose,
}: RaiseWorkOrderDialogProperties) => {
  const titleId = useId();
  const typeId = useId();
  const dueDateId = useId();
  const createWorkOrder = useCreateWorkOrder(plantId, assetId);

  const [title, setTitle] = useState('');
  const [type, setType] = useState(WorkOrderType.CORRECTIVE);
  const [dueDate, setDueDate] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isValid = title.trim() !== '';
  const titleError = hasSubmitted && !isValid ? ASSET_COPY.TITLE_REQUIRED : undefined;

  const handleTitleChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setTitle(changeEvent.target.value);
  };

  const handleDueDateChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setDueDate(changeEvent.target.value);
  };

  const handleTypeChange = (value: string) => {
    setType(findEnumValue(TYPE_ORDER, value) ?? WorkOrderType.CORRECTIVE);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleSubmit = (submitEvent: SubmitEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setHasSubmitted(true);
    if (isValid) {
      createWorkOrder.mutate(
        { plantId, assetId, data: { title: title.trim(), type, ...(dueDate && { dueDate }) } },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ASSET_COPY.RAISE_TITLE}</DialogTitle>
          <DialogDescription>{ASSET_COPY.RAISE_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField controlId={titleId} label={ASSET_COPY.TITLE_LABEL} error={titleError}>
            <Input
              id={titleId}
              value={title}
              aria-invalid={Boolean(titleError)}
              onChange={handleTitleChange}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField controlId={typeId} label={ASSET_COPY.TYPE_LABEL_FIELD}>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger id={typeId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_ORDER.map((option) => (
                    <SelectItem key={option} value={option}>
                      {WORK_ORDER_TYPE_LABEL[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              controlId={dueDateId}
              label={ASSET_COPY.DUE_DATE_LABEL}
              hint={ASSET_COPY.DUE_DATE_HINT}
            >
              <Input id={dueDateId} type="date" value={dueDate} onChange={handleDueDateChange} />
            </FormField>
          </div>
          {createWorkOrder.isError && (
            <FormMessage message={createWorkOrder.error.message || ASSET_COPY.RAISE_FAILED} />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {ASSET_COPY.CANCEL}
            </Button>
            <SubmitButton
              isSubmitting={createWorkOrder.isPending}
              submittingLabel={ASSET_COPY.RAISING}
            >
              {ASSET_COPY.RAISE}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
