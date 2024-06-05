declare namespace kakao.maps {
    class LatLng {
        constructor(lat: number, lng: number);
    }

    class Map {
        constructor(container: HTMLElement | null, options: MapOptions);
    }

    interface MapOptions {
        center: LatLng;
        level: number;
    }

    class Marker {
        constructor(options: MarkerOptions);
        setMap(map: Map | null): void;
    }

    interface MarkerOptions {
        position: LatLng;
    }

    function load(callback: () => void): void;
}
