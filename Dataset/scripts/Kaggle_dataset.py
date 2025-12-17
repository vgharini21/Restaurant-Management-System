import pandas as pd
import numpy as np # Needed later for NaN/null handling
import re

# 1. Load the dataframes
# Use the actual file paths where you downloaded them
df_restaurants = pd.read_csv('restaurants.csv')
df_menus = pd.read_csv('restaurant-menus.csv')

# print("--- Restaurants Data (Head and Info) ---")
# print(df_restaurants.head())
# print(df_restaurants.info())

# print("\n--- Menu Data (Head and Info) ---")
# print(df_menus.head())
# print(df_menus.info())

def clean_price(price_str):
    if pd.isna(price_str):
        return None
    try:
        # Strip currency codes/symbols and convert to float
        # This function returns the clean price as a float or None
        cleaned = re.sub(r'[^\d\.]', '', str(price_str))
        return float(cleaned)
    except ValueError:
        return None

# The original 'price' column is the string column.
# We apply the cleaning function and store the result in a NEW column named 'clean_price'.
df_menus['clean_price'] = df_menus['price'].apply(clean_price)

# Handle items with missing or zero price
df_menus.dropna(subset=['clean_price'], inplace=True)
df_menus = df_menus[df_menus['clean_price'] > 0]

# Now, we drop the original string 'price' column
df_menus.drop(columns=['price'], inplace=True)

# And RENAME the clean float column to 'price' to match the API contract
df_menus.rename(columns={'clean_price': 'price'}, inplace=True)
MAX_CATEGORY_LENGTH = 1000
df_menus['category'] = df_menus['category'].astype(str).str[:MAX_CATEGORY_LENGTH]
# Now, this print statement will work because the clean column is named 'price'
print("--- Menu Data After Price Cleaning ---")
print(df_menus[['restaurant_id', 'price']].head())

# --- Generating Unique menu[].id (Step 2 from previous answer) ---

# 2. Generate a unique 'id' for each menu item (menu_item_id)
# First, ensure restaurant_id is a string for concatenation
df_menus['restaurant_id_str'] = df_menus['restaurant_id'].astype(str)

# Group by restaurant and assign a sequential number to each item within that group
df_menus['item_sequence'] = df_menus.groupby('restaurant_id')['restaurant_id'].cumcount() + 1

# Create the final unique item ID (e.g., "1_1", "1_2", "2_1")
df_menus['menu_item_id'] = df_menus['restaurant_id_str'] + '_' + df_menus['item_sequence'].astype(str)

# Drop helper columns
df_menus.drop(columns=['restaurant_id_str', 'item_sequence'], inplace=True)

# Rename the core columns to match the DynamoDB/API expectations for clarity
df_menus.rename(columns={
    'restaurant_id': 'restaurantId', # Renamed to match case in Order contract
    'category': 'category',
    'name': 'name',
    'description': 'description',
    'price': 'price',
    'menu_item_id': 'id' # Renamed to 'id' to match the 'menu[]' contract field
}, inplace=True)


print("\n--- Menu Data After ID Generation and Final Cleanup ---")
# Only show the columns we need for the menu item object
print(df_menus[['id', 'name', 'description', 'price', 'category', 'restaurantId']].head())

# --- Cleaning df_restaurants ---

# 1. Handle missing 'score' (which maps to 'rating')
# Fill missing scores with 0.0 (or another chosen default)
df_restaurants['score'].fillna(0.0, inplace=True)

# 2. Rename columns to match the target #Restaurant contract
df_restaurants.rename(columns={
    'id': 'id',
    'name': 'name',
    'score': 'rating', # 'score' maps to 'rating' in contract
    'category': 'cuisine', # 'category' maps to 'cuisine' in contract
    # REMOVED: 'img1': 'image', as 'img1' is not in the CSV
}, inplace=True)

# Select only the relevant columns for the final restaurant object
# We include 'full_address' for potential future use and exclude it from the final JSON later.
df_restaurants_clean = df_restaurants[['id', 'name', 'rating', 'cuisine']].copy()

# Add a placeholder 'image' column since it is REQUIRED by the API contract:
df_restaurants_clean['image'] = 'https://s3.amazonaws.com/project-assets/default-restaurant.jpg' 
df_restaurants_clean['description'] = 'Authentic food and fast delivery.' # Adding a placeholder description

print("\n--- Restaurant Data Cleaned ---")
print(df_restaurants_clean.head())

# --- Aggregation and Merge ---

# 1. Define the columns needed for the nested menu item object
menu_item_cols = ['id', 'name', 'description', 'price', 'category']

# 2. Group the cleaned menu items by their restaurantId and aggregate into a list
# 'restaurantId' is the linking column (which was the original 'restaurant_id')
df_menus_grouped = df_menus.groupby('restaurantId')[menu_item_cols].apply(
    lambda x: x.to_dict('records')
).reset_index(name='menu')

# 3. Merge the grouped menu data back into the cleaned restaurant data
# Note: df_restaurants_clean['id'] must be of the same type as df_menus_grouped['restaurantId']
# Convert them to string before merging to be safe.
df_restaurants_clean['id_str'] = df_restaurants_clean['id'].astype(str)
df_menus_grouped['restaurantId_str'] = df_menus_grouped['restaurantId'].astype(str)

final_df = pd.merge(
    df_restaurants_clean,
    df_menus_grouped,
    left_on='id_str',
    right_on='restaurantId_str',
    how='inner' # Only keep restaurants that actually have menu items
)

# Clean up helper columns
final_df.drop(columns=['id_str', 'restaurantId', 'restaurantId_str'], inplace=True)

print("\n--- Final Merged DataFrame (Nested Structure) ---")
print(final_df.head())

# --- Final Output to JSON ---
unique_restaurant_ids = final_df['id'].unique()
poc_ids = unique_restaurant_ids[:500]
final_df_poc = final_df[final_df['id'].isin(poc_ids)].copy()

print(f"\n--- Filtered Dataset Summary ---")
print(f"Total restaurants selected: {len(final_df_poc)}")
# Convert the DataFrame to a list of JSON records
restaurant_list_json = final_df_poc.to_json(orient='records', indent=4)

# You can save this list to a file for ingestion into S3/OpenSearch
with open('cleaned_restaurant_data.json', 'w') as f:
    f.write(restaurant_list_json)

print("\nSuccessfully created and saved 'cleaned_restaurant_data.json'.")
