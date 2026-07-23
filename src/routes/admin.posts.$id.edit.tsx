import { createFileRoute, useParams } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  ssr: false,
  component: EditPostRoute,
});

function EditPostRoute() {
  const { id } = useParams({ from: "/admin/posts/$id/edit" });
  return <PostEditor postId={id} />;
}
