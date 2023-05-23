import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { download, qrCode } from 'ionicons/icons'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'
import { Media,MediaSaveOptions } from '@capacitor-community/media'
import { isPlatform } from '@ionic/react'
import './Home.css'

const Home: React.FC = () => {
  const [textInput, setTextInput] = useState('')
  const [scanResult, setScanResult] = useState('')
  const [scanActive, setScanActive] = useState(false)
  const canvasRef = useRef<HTMLInputElement>(null)

  const downloadQrCode = async () => {
    let canvas = canvasRef!.current!.querySelector('canvas')
    let image = canvas!.toDataURL('image/png')
  
    if (!isPlatform('hybrid')) {
      let anchor = document.createElement('a')
      anchor.href = image
      anchor.download = `qr-code.png`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
    } else {
      // Guardar la imagen en el dispositivo móvil
      let base64Image = image.split(',')[1];  // obtenemos el string base64 de la imagen
      let opts: MediaSaveOptions = { 
        path: base64Image,
       // nombre del album donde se guardará la imagen, debes reemplazarlo
        // según tu preferencia
      };
      try {
        await Media.savePhoto(opts);
        console.log('QR Code saved to device!');
      } catch(e) {
        console.error('Unable to save QR Code:', e);
      }
    }
  }
  




  const scanQrCode = async () => {
    await BarcodeScanner.checkPermission({ force: true })

    BarcodeScanner.hideBackground()
    setScanActive(true)
    document.body.classList.add('scanner-active')

    const result = await BarcodeScanner.startScan() // start scanning and wait for a result

    if (result.hasContent) {
      setScanResult(result.content || '')
      setScanActive(false)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Academy QR Codes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={scanActive ? 'hidden' : ''}>
        <IonItem>
          <IonInput
            placeholder="My QR Code data"
            onIonChange={(e: any) => setTextInput(e.detail.value)}
          />
        </IonItem>

        <IonButton onClick={scanQrCode} expand="full" color="secondary">
          <IonIcon icon={qrCode} slot="start" />
          Scan QR Code
        </IonButton>

        <IonCard>
          <IonCardContent className="ion-text-center">
            <div ref={canvasRef}>
              <QRCodeCanvas
                value={textInput}
                bgColor={'#00ff00'}
                size={250}
                includeMargin={true}
              />
            </div>
            <IonButton onClick={downloadQrCode} expand="full">
              <IonIcon icon={download} slot="start" />
              Download QR Code
            </IonButton>
          </IonCardContent>
        </IonCard>

        {scanResult !== '' && (
          <IonCard>
            <IonCardContent>Result from scan: {scanResult}</IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Home