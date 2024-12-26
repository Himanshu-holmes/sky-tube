import { Trash2, X } from "lucide-react";
import React from "react";

const DeleteConfirm = ({ onCancel, onDelete, comment, tweet, video }) => {
  return (
    <>
      <div class="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
        <div class="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
          <div class="mb-6 flex items-start gap-4">
            <span class="inline-block h-8 w-8 shrink-0 rounded-full bg-red-200 p-1 text-red-700">
              <Trash2 width={20} height={20} />
            </span>
            <h2 class="text-xl font-semibold">
              Delete{" "}
              {`${comment ? "Comment" : ""} ${tweet ? "Tweet" : ""} ${
                video ? "Video" : ""
              }`}{" "}
              <span class="block text-sm text-gray-300">
                Are you sure you want to delete this ? Once its deleted, you
                will not be able to recover it.
              </span>
            </h2>
            <button class="ml-auto h-6 w-6 shrink-0" onClick={onCancel}>
              <X height={20} width={20} />
            </button>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button
              class="col-span-2 border px-4 py-3 sm:col-span-1"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              class="col-span-2 bg-red-700 px-4 py-3 disabled:bg-[#E4D3FF] sm:col-span-1"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirm;
