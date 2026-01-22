import { Metadata, ResolvingMetadata } from 'next';
import { fetchWithMeta } from '@/lib/api/client';
import { Location } from '@/lib/types';
import LocationDetailClientPage from './client-page';

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

// Generate Dynamic Metadata
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id;

    try {
        const { data: location } = await fetchWithMeta<Location>(`/locations/${id}`);

        const previousImages = (await parent).openGraph?.images || [];

        return {
            title: location.name_vi,
            description: location.description_vi || `Khám phá ${location.name_vi} tại ${location.address_vi}`,
            openGraph: {
                title: `${location.name_vi} - Food Finder`,
                description: location.description_vi || `Địa chỉ: ${location.address_vi}`,
                images: location.photos?.[0] ? [location.photos[0].url, ...previousImages] : previousImages,
            },
        };
    } catch (error) {
        return {
            title: 'Food Finder',
            description: 'Chi tiết địa điểm',
        };
    }
}

import { JsonLd } from './json-ld';

export default async function Page({ params }: Props) {
    let locationData = null;
    try {
        const { data } = await fetchWithMeta<Location>(`/locations/${params.id}`);
        locationData = data;
    } catch (e) {
        // Fallback or handle error - client page handles UI error
    }

    return (
        <>
            {locationData && <JsonLd location={locationData} />}
            <LocationDetailClientPage id={params.id} />
        </>
    );
}
