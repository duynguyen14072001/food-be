import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import dayjs from 'dayjs';

@Injectable()
export class MapsService {
  constructor(private readonly httpService: HttpService) {}

  async getTravelTime(
    originPlaceId: string,
    destinationPlaceId: string,
  ): Promise<any> {
    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&mode=driving&key=${apiKey}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;

    if (data.status === 'OK' && data.routes?.[0]?.legs?.[0]?.duration) {
      const duration = data.routes[0].legs[0].duration.value;
      const estimatedTime = dayjs().add(duration, 'second').toDate();
      return estimatedTime;
    } else {
      throw new Error(data.error_message || 'Error');
    }
  }
}
