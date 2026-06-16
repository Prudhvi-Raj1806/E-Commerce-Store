import { Check, X } from 'lucide-react'
import type { BrandingOption, ProductSpecification } from '@/types'

interface ProductSpecsProps {
  specifications?: ProductSpecification[]
  brandingOptions?: BrandingOption[]
  leadTime?: string
  moq?: number
}

export function ProductSpecs({ specifications, brandingOptions, leadTime, moq }: ProductSpecsProps) {
  return (
    <div className="space-y-8">
      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-4">
        {moq && (
          <div className="bg-lightGray rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-1">Min. Order</p>
            <p className="font-display font-semibold text-primary text-lg">{moq} units</p>
          </div>
        )}
        {leadTime && (
          <div className="bg-lightGray rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-1">Lead Time</p>
            <p className="font-display font-semibold text-primary text-lg">{leadTime}</p>
          </div>
        )}
      </div>

      {/* Specifications Table */}
      {specifications && specifications.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-primary mb-4">Product Specifications</h3>
          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            {specifications.map((spec) => (
              <div key={spec.label} className="flex items-start px-4 py-3 odd:bg-lightGray/50">
                <span className="w-2/5 text-sm font-medium text-muted-foreground shrink-0">{spec.label}</span>
                <span className="text-sm text-primary">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branding Options */}
      {brandingOptions && brandingOptions.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-primary mb-4">Branding Options</h3>
          <div className="space-y-2">
            {brandingOptions.map((option) => (
              <div
                key={option.method}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-lightGray"
              >
                <div className="flex items-center gap-3">
                  {option.included ? (
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center">
                      <X className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-primary">{option.method}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {option.included
                    ? 'Included'
                    : option.additionalCost
                      ? `+₹${option.additionalCost}/unit`
                      : 'On request'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
