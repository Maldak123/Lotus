import React from 'react'
import { getArchiveType } from '@/utils/fileExtensions';

interface FileIconProps{
  extension: string
}

const FileIcon = ({ extension }: FileIconProps) => {
  const [nome, info] = getArchiveType(extension) || [];

  if (nome && info) {
    return (
      <div
        className={`w-fit rounded p-2 text-xs font-bold ${info.bgColor} ${info.textColor}`}
      >
        {nome}
      </div>
    );
  }
};

export default FileIcon