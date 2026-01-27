import useSWR from 'swr';

interface Tag {
    id: string;
    name_vi: string;
    name_en: string;
    icon?: string;
    category: 'positive' | 'negative';
}

interface TagsResponse {
    success: boolean;
    data: {
        positive: Tag[];
        negative: Tag[];
    };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTags() {
    const { data, error, isLoading } = useSWR<TagsResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/tags`,
        fetcher
    );

    return {
        tags: data?.data,
        allTags: data?.data ? [...data.data.positive, ...data.data.negative] : [],
        positiveTags: data?.data?.positive || [],
        negativeTags: data?.data?.negative || [],
        isLoading,
        isError: error,
    };
}
