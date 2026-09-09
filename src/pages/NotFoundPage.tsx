import { Compass } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export function NotFoundPage() {
  return (
    <div className="py-12 space-y-4">
      <Breadcrumbs items={[{ label: '404 - Page Not Found' }]} />
      <EmptyState
        icon={Compass}
        title="Page Not Found"
        description="We couldn't find the page or grocery shelf you're looking for. It might have been moved or is out of season."
        actionLabel="Back to Home"
        actionHref="/"
        secondaryActionLabel="Explore Catalog"
        onSecondaryAction={() => {
          window.location.href = '/products';
        }}
      />
    </div>
  );
}
