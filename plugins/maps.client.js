export default function (context, inject) {
  let isLoaded = !true
  let waiting = []
  addScript()

  inject('maps', {
    showMap,
    makeAutoComplete,
  })

  function addScript() {
    const script = document.createElement('script')
    script.src =
      'https:maps.googleapis.com/maps/api/js?key=AIzaSyCFIDdK19LZC_2PsiWOpEtgWdxx4Lhawoo&libraries=places&callback=initGoogleMaps'
    script.async = true
    window.initGoogleMaps = initGoogleMaps
    document.head.appendChild(script)
  }

  function initGoogleMaps() {
    isLoaded = true
    waiting.forEach((item) => {
      if (typeof item.fn === 'function') {
        item.fn(...item.arguments)
      }
    })
    waiting = []
  }

  function makeAutoComplete(input) {
    if (!isLoaded) {
      waiting.push({ fn: makeAutoComplete, arguments })
      return
    }

    const autoComplete = new window.google.maps.places.Autocomplete(input, {
      types: ['(cities)'],
    })

    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace()
      input.dispatchEvent(new CustomEvent('changed', { detail: place }))
    })
  }

  function showMap(canvas, lat, lng, markers) {
    if (!isLoaded) {
      waiting.push({
        fn: showMap,
        arguments,
      })
      return
    }

    const mapOptions = {
      zoom: 18,
      disableDefaultUI: true,
      zoomcontrol: true,
      center: new window.google.maps.LatLng(lat, lng),
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }

    const map = new window.google.maps.Map(canvas, mapOptions)

    if (!markers) {
      const position = new window.google.maps.LatLng(lat, lng)
      const marker = new window.google.maps.Marker({
        position,
        clickable: !true,
      })
      marker.setMap(map)
      return
    }

    const bounds = new window.google.maps.LatLngBounds()

    markers.forEach((home) => {
      const position = new window.google.maps.LatLng(home.lat, home.lng)
      const marker = new window.google.maps.Marker({
        position,
        label: {
          text: `$${home.pricePerNight}`,
          className: `marker home-${home.id}`,
        },
        icon: 'https://maps.gstatic.com/mapfiles/transparent.png',
        clickable: !true,
      })
      marker.setMap(map)
      bounds.extend(position)
    })
    map.fitBounds(bounds)
  }
}
