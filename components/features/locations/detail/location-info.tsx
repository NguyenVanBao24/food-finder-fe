import { Location } from '@/lib/types';
import { Clock, Phone, Globe, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationInfoProps {
    location: Location;
}

export function LocationInfo({ location }: LocationInfoProps) {
    return (
        <Card className="border-none shadow-lg shadow-gray-100">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Thông tin
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                        <h4 className="font-medium text-sm text-gray-900">Giờ mở cửa</h4>
                        <p className="text-sm text-gray-500">
                            {location.hours_open} - {location.hours_close} (Đang mở cửa)
                        </p>
                    </div>
                </div>

                {location.phone && (
                    <div className="flex gap-3">
                        <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                        <div>
                            <h4 className="font-medium text-sm text-gray-900">Điện thoại</h4>
                            <p className="text-sm text-primary hover:underline cursor-pointer">
                                {location.phone}
                            </p>
                        </div>
                    </div>
                )}

                {location.website && (
                    <div className="flex gap-3">
                        <Globe className="h-5 w-5 text-gray-400 shrink-0" />
                        <div>
                            <h4 className="font-medium text-sm text-gray-900">Website</h4>
                            <a
                                href={location.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-primary hover:underline"
                            >
                                Website của quán
                            </a>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Mô tả</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {location.description_vi || "Chưa có mô tả cho địa điểm này."}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
