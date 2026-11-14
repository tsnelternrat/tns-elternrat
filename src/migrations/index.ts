import * as migration_20261114_094541_baseline from './20261114_094541_baseline';
import * as migration_20261114_094608_bloecke from './20261114_094608_bloecke';
import * as migration_20261114_101710_seiten from './20261114_101710_seiten';
import * as migration_20261114_105133_archiv_unterseiten from './20261114_105133_archiv_unterseiten';

export const migrations = [
  {
    up: migration_20261114_094541_baseline.up,
    down: migration_20261114_094541_baseline.down,
    name: '20261114_094541_baseline',
  },
  {
    up: migration_20261114_094608_bloecke.up,
    down: migration_20261114_094608_bloecke.down,
    name: '20261114_094608_bloecke',
  },
  {
    up: migration_20261114_101710_seiten.up,
    down: migration_20261114_101710_seiten.down,
    name: '20261114_101710_seiten',
  },
  {
    up: migration_20261114_105133_archiv_unterseiten.up,
    down: migration_20261114_105133_archiv_unterseiten.down,
    name: '20261114_105133_archiv_unterseiten'
  },
];
