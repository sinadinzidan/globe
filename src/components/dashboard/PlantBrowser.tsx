import { Search } from 'lucide-react';
import { useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import { PlantList } from '@/components/dashboard/PlantList';
import { SectorFilter } from '@/components/dashboard/SectorFilter';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EXPLORER_COPY } from '@/constants/dashboard/explorerConstants';

/** The plants tab: find a plant by name, narrow by sector, then pick one from the list. */
export const PlantBrowser = () => {
  const searchInputId = useId();

  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setSearchText(changeEvent.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-4 border-b p-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={searchInputId}>{EXPLORER_COPY.SEARCH_LABEL}</Label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id={searchInputId}
              type="search"
              value={searchText}
              placeholder={EXPLORER_COPY.SEARCH_PLACEHOLDER}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
        </div>
        <SectorFilter />
      </div>
      <PlantList searchText={searchText} />
    </>
  );
};
