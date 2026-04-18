import { useRef, useState } from 'react'

const MAX_MB      = 3
const MAX_WIDTH   = 1400   // px — resize larger images down
const JPEG_Q      = 0.82   // JPEG quality (0–1)

/**
 * Compresses an image File via an offscreen canvas.
 * Output is always JPEG regardless of input format.
 * Typical result: 2-3 MB photo → 150-250 KB base64.
 */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = ev => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_WIDTH) {
          height = Math.round(height * MAX_WIDTH / width)
          width  = MAX_WIDTH
        }
        const canvas = document.createElement('canvas')
        canvas.width  = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', JPEG_Q))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Dual-mode image input:
 *  - Click "Upload Image" → file picker → compresses via canvas → stores as JPEG base64
 *  - Or paste a URL manually as fallback
 */
export default function ImageUpload({ value, onChange, label = 'Image', previewStyle = {} }) {
  const inputRef = useRef(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode]       = useState('upload') // 'upload' | 'url'

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    e.target.value = '' // reset so same file can be re-selected

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)')
      return
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_MB) {
      setError(`Image must be under ${MAX_MB}MB. This file is ${sizeMB.toFixed(1)}MB.`)
      return
    }

    setLoading(true)
    try {
      const compressed = await compressImage(file)
      onChange(compressed)
    } catch {
      setError('Failed to process image. Please try another file.')
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const dt = new DataTransfer()
      dt.items.add(file)
      inputRef.current.files = dt.files
      handleFile({ target: inputRef.current })
    }
  }

  function handleDragOver(e) { e.preventDefault() }

  const isBase64 = value?.startsWith('data:')
  const hasImage = !!value

  return (
    <div className="img-upload">
      <label className="img-upload__label">{label}</label>

      {/* Mode toggle */}
      <div className="img-upload__modes">
        <button
          type="button"
          className={`img-upload__mode-btn ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => setMode('upload')}
        >
          📁 Upload from device
        </button>
        <button
          type="button"
          className={`img-upload__mode-btn ${mode === 'url' ? 'active' : ''}`}
          onClick={() => setMode('url')}
        >
          🔗 Use URL
        </button>
      </div>

      {/* Preview */}
      {hasImage && (
        <div className="img-upload__preview-wrap">
          <img
            src={value}
            alt="preview"
            className="img-upload__preview"
            style={previewStyle}
            onError={e => { e.target.style.display = 'none' }}
          />
          <button
            type="button"
            className="img-upload__remove"
            onClick={() => onChange('')}
            title="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === 'upload' && (
        <div
          className={`img-upload__drop ${loading ? 'img-upload__drop--loading' : ''}`}
          onClick={() => !loading && inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          {loading ? (
            <span className="img-upload__spinner">Processing…</span>
          ) : (
            <>
              <span className="img-upload__drop-icon">🖼</span>
              <span className="img-upload__drop-text">
                {hasImage ? 'Click or drag to replace image' : 'Click or drag image here'}
              </span>
              <span className="img-upload__drop-hint">JPG, PNG, WebP — max {MAX_MB}MB</span>
            </>
          )}
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <input
          type="url"
          className="img-upload__url-input"
          value={isBase64 ? '' : (value || '')}
          onChange={e => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg  or  /images/photo.jpg"
        />
      )}

      {error && <p className="img-upload__error">{error}</p>}
    </div>
  )
}
