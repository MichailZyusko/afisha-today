import QRCode from 'qrcode';
import { pathToAssets } from '../../config';

type TEncodeProps = {
  payload: unknown;
  userId: string;
};

export class QRC {
  static async encode({ payload, userId }: TEncodeProps) {
    try {
      await QRCode.toFile(
        `${pathToAssets}/qrcode/${userId}.png`,
        JSON.stringify(payload),
      );
    } catch (e) {
      console.error(`Error during data encoding: ${e}`);
    }
  }
}
