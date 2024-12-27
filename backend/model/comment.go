package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Comment represents the MongoDB Comment schema
type Comment struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`       // MongoDB Object ID
	Content   string             `bson:"content"`            // Comment content
	VideoID   primitive.ObjectID `bson:"video,omitempty"`    // Reference to the Video ID
	OwnerID   primitive.ObjectID `bson:"owner,omitempty"`    // Reference to the Owner (User) ID
	CreatedAt time.Time          `bson:"created_at"`         // Timestamp when created
	UpdatedAt time.Time          `bson:"updated_at"`         // Timestamp when updated
}
