export const extensionsType = {
  WORD: {
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-500",
    extensions: [".doc", ".docx"],
  },
  PDF: {
    mimeTypes: ["application/pdf"],
    bgColor: "bg-red-500/20",
    textColor: "text-red-500",
    extensions: [".pdf"],
  },
  EXCEL: {
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    bgColor: "bg-green-500/20",
    textColor: "text-green-500",
    extensions: [".xls", ".xlsx"],
  },
  MARKDOWN: {
    mimeTypes: ["text/markdown"],
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-500",
    extensions: [".md"],
  },
};

export const getArchiveType = (mimeType: string) => {
  return Object.entries(extensionsType).find(([_, info]) =>
    info.mimeTypes.includes(mimeType as string),
  );
};
