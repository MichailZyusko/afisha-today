import QRCode from 'qrcode';
import { PATH_TO_ASSETS } from '../../config';

type TEncodeProps = {
  payload: unknown;
  userId: string;
};

export class QRC {
  static async encode({ payload, userId }: TEncodeProps) {
    try {
      const path = `${PATH_TO_ASSETS}/qrcode/${userId}.png`;

      await QRCode.toFile(
        path,
        JSON.stringify(payload),
      );

      return { path };
    } catch (e) {
      throw new Error(`Error during data encoding: ${e}`);
    }
  }
}
