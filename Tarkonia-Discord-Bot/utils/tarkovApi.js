import fetch from 'node-fetch';

const TARKOV_API_URL = 'https://api.tarkov.dev/graphql';
const TARKOV_CHANGES_API_URL = process.env.Tarkov_Changes_API;
const TARKOV_CHANGES_API_KEY = process.env.Tarkov_Changes_API_KEY;

async function queryTarkovAPI(query) {
  const response = await fetch(TARKOV_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

export async function searchItem(itemName) {
  const query = `
    query {
      items(name: "${itemName}") {
        name
        shortName
        description
        basePrice
        width
        height
        weight
        avg24hPrice
        traderPrices {
          price
          trader {
            name
          }
        }
      }
    }
  `;
  const data = await queryTarkovAPI(query);
  return data.data.items;
}

export async function searchAmmo(ammoName) {
  const query = `
    query {
      ammo(name: "${ammoName}") {
        item {
          name
        }
        damage
        penetrationPower
        armorDamage
        fragmentationChance
      }
    }
  `;
  const data = await queryTarkovAPI(query);
  return data.data.ammo[0];
}

export async function getMapInfo(mapName) {
  const query = `
    query {
      maps(name: "${mapName}") {
        name
        description
        raidDuration
        players
        bosses {
          name
          spawnChance
        }
      }
    }
  `;
  const data = await queryTarkovAPI(query);
  return data.data.maps[0];
}

export async function getQuests(questName) {
  const query = `
    query {
      tasks(name: "${questName}") {
        name
        trader {
          name
        }
        map {
          name
        }
        experience
        objectives {
          description
        }
      }
    }
  `;
  const data = await queryTarkovAPI(query);
  return data.data.tasks;
}

export async function getTraders() {
  const query = `
    query {
      traders {
        name
        resetTime
      }
    }
  `;
  const data = await queryTarkovAPI(query);
  return data.data.traders;
}

export async function getServerStatus() {
  const response = await fetch(`${TARKOV_CHANGES_API_URL}/status`, {
    headers: { 'Authorization': TARKOV_CHANGES_API_KEY }
  });
  return response.json();
}

export async function getLatestChanges() {
  const response = await fetch(`${TARKOV_CHANGES_API_URL}/latest`, {
    headers: { 'Authorization': TARKOV_CHANGES_API_KEY }
  });
  return response.json();
}

