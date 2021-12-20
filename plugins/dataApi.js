import {unWrap, getErrorResponse} from '~/utils/fetchUtils'

  export default function ({ $config }, inject) {
    
    const headers = {
      'X-Algolia-API-Key': $config.algolia.key,
      'X-Algolia-Application-Id': $config.algolia.appId
      }
  
    inject('dataApi', {
      getHome,
      getReviewsByHomeId,
      getUserByHomeId,
      getHomesByLocation,
    })
  
    async function getHome(homeId) {
      try {
        return unWrap(
          await fetch(
            `https://${$config.algolia.appId}-dsn.algolia.net/1/indexes/homes/${homeId}`,
            { headers }
          )
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    }
  
    async function getReviewsByHomeId(homeId) {
      try {
        return unWrap(
          await fetch(
            `https://${$config.algolia.appId}-dsn.algolia.net/1/indexes/reviews/query`,
            {
              headers,
              method: 'POST',
              body: JSON.stringify({
                filters: `homeId:${homeId}`,
                hitsPerPage: 6,
                attributesToHighlight: [],
              }),
            }
          )
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    }
  
    async function getUserByHomeId(homeId) {
      try {
        return unWrap(
          await fetch(`https://${$config.algolia.appId}-dsn.algolia.net/1/indexes/users/query`, {
            headers,
            method: 'POST',
            body: JSON.stringify({
              filters: `homeId:${homeId}`,
              attributesToHighlight: [],
            }),
          })
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    }
  
    async function getHomesByLocation(Lat, Lng, radiusInMeters = 1500 * 15) {
      try {
        return unWrap(
          await fetch(`https://${$config.algolia.appId}-dsn.algolia.net/1/indexes/homes/query`, {
            headers,
            method: 'POST',
            body: JSON.stringify({
              aroundRadius: radiusInMeters,
              aroundLatLng: `${Lat}, ${Lng}`,
              hitsPerPage: 10,
              attributesToHighlight: [],
            }),
          })
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    }
  
    
  }


