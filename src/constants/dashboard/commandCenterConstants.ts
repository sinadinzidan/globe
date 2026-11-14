import { PlantSector } from '@/enums/dashboard/plantSector';

/** What each stream of the value chain covers. */
export const STREAM_DESCRIPTION: Record<PlantSector, string> = {
  [PlantSector.UPSTREAM]: 'Oil and gas fields, onshore and offshore',
  [PlantSector.MIDSTREAM]: 'Gas processing, LNG, pipelines and terminals',
  [PlantSector.DOWNSTREAM]: 'Refining, petrochemicals and fertilisers',
};

export const COMMAND_CENTER_COPY = {
  TAB: 'Operations',
  STREAMS_TITLE: 'Value chain',
  STREAMS_HINT: 'Select a stream to show only its sites on the map.',
  SITES: 'Sites',
  OPERATING: 'operating',
  ASSETS: 'Assets',
  RUNNING: 'running',
  MAINTENANCE: 'In maintenance',
  WORK_ORDERS: 'Open work orders',
  AVAILABILITY_LABEL: 'Share of assets running',
  NO_ASSETS: 'No sites in reach',
  ATTENTION_TITLE: 'Needs attention',
  ATTENTION_DESCRIPTION: 'Assets that are not running.',
  ATTENTION_EMPTY_TITLE: 'All clear',
  ATTENTION_EMPTY_DESCRIPTION: 'Every asset you can reach is running.',
  LOADING: 'Loading operations…',
} as const;
