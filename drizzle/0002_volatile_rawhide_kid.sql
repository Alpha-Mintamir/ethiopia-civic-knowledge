CREATE TABLE "directory_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" jsonb NOT NULL,
	"org_type" text NOT NULL,
	"description" jsonb,
	"website" text,
	"phone" text,
	"email" text,
	"address" jsonb,
	"layer" "info_layer" DEFAULT 'official' NOT NULL,
	"last_verified_at" timestamp with time zone,
	"added_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "directory_contacts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "directory_contacts" ADD CONSTRAINT "directory_contacts_added_by_id_users_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "directory_contacts_type_idx" ON "directory_contacts" USING btree ("org_type");--> statement-breakpoint
CREATE INDEX "directory_contacts_layer_idx" ON "directory_contacts" USING btree ("layer");