'use client'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import area from '@turf/area'
import { Feature, Polygon } from 'geojson'
import L, { LatLngExpression } from 'leaflet'
import { Tag } from 'lucide-react'
import { useRef, useState } from 'react'
import { FeatureGroup, MapContainer } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet-defaulticon-compatibility'

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'

import BaseMapLayer from '@/components/map-display/base-map-layer'
import { LeafletControl } from '@/components/map-display/leaflet-control'
import { MapActionButton } from '@/components/map-display/map-action-button'
import PaddockLabelLayer from '@/components/map-display/paddock-label-layer'
import Typography from '@/components/ui/typography'

import { usePaddockStore } from '@/stores/use-paddock-store'

import MapCommandExecutor from '@/elements/farm/create/farm-map-display/map-command-executor'

// --- Định nghĩa kiểu (Type) ---

// Gắn 'feature' tùy chỉnh vào L.Polygon để theo dõi
interface PaddockLayer extends L.Polygon {
  feature?: Feature<Polygon>
}

// --- Component MapDisplay chính ---

export default function FarmMapDisplay() {
  const {
    baseLayerType,
    paddocks,
    addPaddock,
    removePaddockById,
    updatePaddockById,
    nextPaddockName,
    setNextPaddockName, // Lấy hàm set cho logic modal
  } = usePaddockStore()

  // State cho modal nhập tên
  const [pendingPaddock, setPendingPaddock] = useState<PaddockLayer | null>(
    null,
  )
  const [modalPaddockName, setModalPaddockName] = useState<string>('')
  const [showLabels, setShowLabels] = useState<boolean>(true)
  const featureGroupRef = useRef<L.FeatureGroup | null>(null)
  const defaultCenter: LatLngExpression = [20, 0]

  // --- HÀM XỬ LÝ SỰ KIỆN CỦA LEAFLET-DRAW ---

  /**
   * Kích hoạt khi một shape được VẼ XONG.
   */
  const handleCreated = (e: L.DrawEvents.Created) => {
    const layer = e.layer as PaddockLayer
    const name = nextPaddockName.trim()

    if (name) {
      // TRƯỜNG HỢP 1: ĐÃ CÓ TÊN (từ input ở Step 3)
      const geoJSON = layer.toGeoJSON() as Feature<Polygon>
      const id = crypto.randomUUID()

      geoJSON.properties = {
        name: name,
        paddock_id: id,
        area_ha: +(area(geoJSON) / 10000).toFixed(4),
      }
      layer.feature = geoJSON // Gắn data vào layer để theo dõi
      addPaddock(geoJSON)

      // Xóa tên đã dùng, để lần vẽ sau sẽ hiện modal
      setNextPaddockName('')
    } else {
      // TRƯỜNG HỢP 2: CHƯA CÓ TÊN -> KÍCH HOẠT MODAL
      setPendingPaddock(layer)
    }
  }

  /**
   * Kích hoạt khi các shape được SỬA XONG.
   */
  const handleEdited = (e: L.DrawEvents.Edited) => {
    e.layers.eachLayer((layer) => {
      const pLayer = layer as PaddockLayer
      const id = pLayer.feature?.properties?.paddock_id
      if (!id) return

      const updatedGeoJSON = pLayer.toGeoJSON() as Feature<Polygon>

      // Giữ lại properties cũ, chỉ cập nhật diện tích
      updatedGeoJSON.properties = pLayer.feature?.properties || {}
      updatedGeoJSON.properties.area_ha = +(
        area(updatedGeoJSON) / 10000
      ).toFixed(4)

      // Gắn lại feature mới
      pLayer.feature = updatedGeoJSON
      updatePaddockById(id, updatedGeoJSON)
    })
  }

  /**
   * Kích hoạt khi các shape bị XÓA.
   */
  const handleDeleted = (e: L.DrawEvents.Deleted) => {
    e.layers.eachLayer((layer) => {
      const pLayer = layer as PaddockLayer
      const id = pLayer.feature?.properties?.paddock_id
      if (id) {
        removePaddockById(id)
      }
    })
  }

  // --- HÀM XỬ LÝ MODAL NHẬP TÊN ---

  /**
   * Kích hoạt khi nhấn nút "Save Paddock" trên modal.
   */
  const handleModalSave = () => {
    if (!pendingPaddock) return

    const layer = pendingPaddock
    const name = modalPaddockName.trim() || 'Paddock' // Tên mặc định

    // Hoàn tất logic tạo Paddock (giống handleCreated)
    const geoJSON = layer.toGeoJSON() as Feature<Polygon>
    const id = crypto.randomUUID()
    geoJSON.properties = {
      name: name,
      paddock_id: id,
      area_ha: +(area(geoJSON) / 10000).toFixed(4),
    }
    layer.feature = geoJSON
    addPaddock(geoJSON)

    // Dọn dẹp state
    setPendingPaddock(null)
    setModalPaddockName('')
  }

  /**
   * Kích hoạt khi Dialog bị đóng (bằng nút 'x' hoặc click bên ngoài).
   */
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Nếu người dùng đóng modal mà không lưu
      if (pendingPaddock) {
        // Coi như họ đã hủy, xóa layer vừa vẽ khỏi bản đồ
        pendingPaddock.remove()
      }
      setPendingPaddock(null)
      setModalPaddockName('')
    }
  }

  // --- RENDER COMPONENT CHÍNH ---

  return (
    <MapContainer
      center={defaultCenter}
      zoom={2}
      style={{ height: '560px', width: '100%' }}
      className='rounded-md border z-0'
    >
      {/* 1. Component quản lý Base map (satellite, hybrid) */}
      <BaseMapLayer hasBoundariesAndLabels={baseLayerType === 'hybrid'} />

      {/* 2. Component thực thi lệnh (setView, fitBounds) */}
      <MapCommandExecutor />

      {/* 3. Component render nhãn (labels) */}
      <PaddockLabelLayer
        featureGroupRef={featureGroupRef}
        showLabels={showLabels}
        dependencies={paddocks}
      />

      {/* 4. Layer chứa các Paddock (do EditControl quản lý) */}
      <FeatureGroup ref={featureGroupRef}>
        <LeafletControl position='topleft'>
          <MapActionButton
            icon={Tag}
            label='Show paddock name'
            isActive={showLabels}
            onClick={() => setShowLabels((prev) => !prev)}
          />
        </LeafletControl>
        <EditControl
          position='topleft'
          onCreated={handleCreated}
          onEdited={handleEdited}
          onDeleted={handleDeleted}
          draw={{
            polygon: {
              allowIntersection: false,
              shapeOptions: {
                color: '#3b82f6', // Brand color
                fillOpacity: 0.3,
              },
            },
            polyline: false,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
          edit={{
            remove: true,
          }}
        />
      </FeatureGroup>

      {/* 5. Modal nhập tên Paddock (chỉ hiển thị khi pendingPaddock có giá trị) */}
      <Modal isOpen={!!pendingPaddock} onOpenChange={handleModalOpenChange}>
        <ModalContent>
          <ModalHeader className='flex flex-col'>
            <div>Name your Paddock</div>
            <Typography size='sm' type='secondary' className='font-normal'>
              Please enter a name for the new paddock you just drew.
            </Typography>
          </ModalHeader>

          <ModalBody className='flex flex-col justify-center items-center'>
            <Input
              variant='bordered'
              value={modalPaddockName}
              onChange={(e) => setModalPaddockName(e.target.value)}
              autoFocus
              placeholder='Enter paddock name...'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault() // Ngăn form submit
                  handleModalSave()
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onPress={handleModalSave}>
              Save Paddock
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MapContainer>
  )
}
