

export function JsonLd({ location }: { location: any }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: location.name_vi,
        image: location.photos?.[0]?.url,
        description: location.description_vi,
        address: {
            '@type': 'PostalAddress',
            streetAddress: location.address_vi,
            addressLocality: location.district_vi,
            addressRegion: 'Da Nang',
            addressCountry: 'VN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: location.latitude,
            longitude: location.longitude,
        },
        url: location.website,
        telephone: location.phone,
        priceRange: location.price_range,
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                ],
                opens: location.hours_open,
                closes: location.hours_close,
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
