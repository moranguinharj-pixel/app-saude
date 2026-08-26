import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { AppData } from "@/shared/records";

export async function shareLocalBackup(data: AppData) {
  if (Platform.OS === "web") {
    throw new Error("A exportação de arquivo está disponível no aplicativo Android.");
  }

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("O compartilhamento de arquivo não está disponível neste dispositivo.");
  }

  const createdAt = new Date().toISOString();
  const payload = JSON.stringify(
    {
      exportedAt: createdAt,
      app: "Registro Pessoal",
      data,
    },
    null,
    2,
  );
  const filename = `registro-pessoal-${createdAt.slice(0, 10)}.json`;
  const file = new File(Paths.cache, filename);
  file.create({ intermediates: true, overwrite: true });
  file.write(payload);
  await Sharing.shareAsync(file.uri, {
    dialogTitle: "Exportar registros pessoais",
    mimeType: "application/json",
    UTI: "public.json",
  });
}
