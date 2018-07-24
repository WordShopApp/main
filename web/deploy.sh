echo "Start Deploying to AWS S3 Bucket"
aws s3 sync ./dist/wordshop s3://wordshop.app --region us-east-1 --acl public-read --delete
echo "Done Deploying to AWS S3 Bucket"

echo "Start Invalidation of AWS CloudFront Cache"
aws configure set preview.cloudfront true
aws cloudfront create-invalidation --distribution-id EHGH4JJ3LDXCA --paths /*
echo "Done Invalidation of AWS CloudFront Cache"
