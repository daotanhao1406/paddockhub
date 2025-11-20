import { TileLayer } from 'react-leaflet'

export default function BaseMapLayer({
  hasBoundariesAndLabels = true,
}: {
  hasBoundariesAndLabels?: boolean
}) {
  return (
    <>
      <TileLayer
        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        attribution='Imagery © Esri, Maxar'
        maxZoom={19}
      />
      {hasBoundariesAndLabels && (
        <TileLayer
          url='https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
          attribution='Labels © Esri'
          pane='overlayPane'
        />
      )}
    </>
  )
}
