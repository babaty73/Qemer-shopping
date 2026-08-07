interface GoogleMapProps {
  address: string;
}

/** Embedded map — no API key required, uses the public Maps embed search endpoint. */
export function GoogleMap({ address }: GoogleMapProps) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-xs">
      <iframe
        title={`Map showing ${address}`}
        src={src}
        width="100%"
        height="320"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block"
      />
    </div>
  );
}
